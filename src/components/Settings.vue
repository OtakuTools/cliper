<template>
  <div>
    <h3>用户设置</h3>
    <ul>
      <li>
        用户id
        <input type="text" placeholder="" v-model="userId">
      </li>
      <li>
        编辑快捷键
        <input type="text" placeholder="" v-model="shortcut">
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "Setting",
  setup() {
    const data = reactive({
      userId: '',
      shortcut: 'Alt + v',
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>
