<template>
  <el-input :modelValue="value" @click="handleInput" />
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { ipcRenderer } from 'electron'

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

    function handleInput () {
      ipcRenderer.on('INPUT_DOWNLOAD_PATH', function (evt, files) {
        setValue(files[0] || '')
      });
      ipcRenderer.send('REQUEST_DOWNLOAD_PATH', { defaultPath: valueRef.value || 'C:\\' });
      return true
    }

    return {
      value: valueRef,
      handleInput
    }
  },
})
</script>
