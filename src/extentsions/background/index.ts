import bridge from './bridge';
import useContextMenu from './contextMenus';
import { EVENT, FEATURE_FLAGS } from '@/constant';

// download事件
bridge.on(EVENT.DOWNLOAD, (evt, payload) => {
  try {
    const file = JSON.parse(payload);
    if (window?.chrome?.downloads) {
      // use extension downloads API
      window.chrome.downloads.download({
        filename: file.name as string,
        url: file.downloadUrl,
        conflictAction: 'prompt', // 文件重名的策略 // prompt 提示用户选择, uniquify 自动重命名, overwrite 覆盖
      })
    } else {
      // no access to extension downloads API, send back to popup page to use axios download
      bridge.send(EVENT.DOWNLOAD, payload);
    }
  } catch (err) {
    console.error('下载文件失败', err);
  }
})

if (FEATURE_FLAGS.EXTENSION_CONTEXTMENU) {
  useContextMenu()
}