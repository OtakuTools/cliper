<template>
  <el-input :modelValue="value" @click="handleFocus" @update:modelValue="handleInput" />
</template>

<script lang="ts">
import { EVENT, isBrowser, isElectron } from '@/constant'
import { defineComponent, toRefs } from 'vue'
import { bridge } from '../event'

export default defineComponent({
  name: 'DirectoryInput',
  emits: {
    'update:modelValue': (value: unknown) => {
      return typeof value === 'string'
    }
  },
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {

    const { modelValue: valueRef } = toRefs(props)
    function setValue (newValue: string) {
      if(newValue !== valueRef.value) {
        emit("update:modelValue", newValue)
      }
    }

    function handleFocus () {
      // 在electron环境下调用gui选择文件夹
      if(isElectron){
        bridge.on(EVENT.INPUT_DOWNLOAD_PATH, (evt: unknown, files: string[]) => {
          setValue(files[0] || '')
        });
        bridge.emit(EVENT.INPUT_DOWNLOAD_PATH, { defaultPath: valueRef.value || 'C:\\' });
        return true
      }
    }

    function handleInput (value: string) {
      // 浏览器环境下输入文件夹路径
      if(isBrowser){
        emit('update:modelValue', value)
      }
    }

    return {
      value: valueRef,
      handleInput,
      handleFocus,
    }
  },
})
</script>
