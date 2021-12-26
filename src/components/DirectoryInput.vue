<template>
  <el-input :modelValue="value" @click="handleInput" />
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { bridge } from '../store'

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
      bridge.on('INPUT_DOWNLOAD_PATH', (evt: unknown, files: string[]) => {
        setValue(files[0] || '')
      });
      bridge.send('REQUEST_DOWNLOAD_PATH', { defaultPath: valueRef.value || 'C:\\' });
      return true
    }

    return {
      value: valueRef,
      handleInput
    }
  },
})
</script>
