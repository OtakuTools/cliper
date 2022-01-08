import { EVENT } from "@/constant";
import { SocketMessage } from "@/socket";
import bridge from "./bridge";

interface ContextMessage {
  /** 所在的页面URL */
  from: string
}

function formatSendMessage(type: 'url' | 'text', name: string, data: string, info: chrome.contextMenus.OnClickData): SocketMessage & ContextMessage {
  return {
    // SocketMessage
    name,
    type,
    data,
    timestamp: Date.now(),
    size: data.length,

    // ContextMessage
    from: info.pageUrl
  }
}

function handleContextMenuClick(info: chrome.contextMenus.OnClickData): void {
  console.group('context menu click');
  console.log(info);
  
  let message: SocketMessage | void
  // 考虑到选择文本有可能包含链接或图片, 故优先发送选择文字
  if (info.selectionText) {
    console.log('selected text', info.selectionText);
    message = formatSendMessage('text', info.selectionText, info.selectionText, info);
  } else if (info.mediaType === 'image' && info.srcUrl) {
    // 图片可能设置有超链接, 故其次发送图片
    console.log('image', info.srcUrl);
    // 注意图片链接地址可能不是合法文件名
    message = formatSendMessage('url', info.srcUrl.replace(/(\\|\/|:|\?|\*|<|>|\||")+/, ''),info.srcUrl, info);
  } else if (info.linkUrl) {
    console.log('link', info.linkUrl);
    message = formatSendMessage('text', info.linkUrl, info.linkUrl, info);
  } else {
    console.error('unknown context click', info);
  }
  console.log(message);
  console.groupEnd();
  return message && bridge.send(EVENT.SEND_MESSAGE, JSON.stringify([message]));
}

// FIXME: 由于Socket位于popup, 而popup非常驻, 目前只有打开popup后使用右键菜单才能正常发送
export default function useContextMenu(): void {
  if (chrome.contextMenus) {
    try {
      window.chrome.contextMenus.create({
        type: "normal",
        title: '发送到频道',
        contexts: [
          "image", // 发送图片
          "link", // 链接, 发送文本
          "selection", // 发送文本
        ],
        onclick: handleContextMenuClick,
      });
    } catch (err) {
      console.warn('创建右键菜单失败', err);
    }
  } else {
    console.warn('获取右键菜单权限失败');
  }
}