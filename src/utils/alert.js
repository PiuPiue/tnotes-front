import { Message } from 'element-ui';

export function alertError(message) {
  Message.error({
    message: message,
    duration: 3000, // 提示持续时间
    showClose: true // 显示关闭按钮
  });
}