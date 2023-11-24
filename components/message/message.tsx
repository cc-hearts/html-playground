
import { createVNode, defineComponent, PropType, render } from 'vue';

const MessageConstructor = defineComponent({
  name: 'Message',
  props: {
    text: {
      type: String as PropType<string>,
      required: true,
    },
    type: {
      type: String as PropType<'success' | 'error' | 'warning'>,
      default: 'success',
    },
  },
  setup(props) {
    return () => (
        <div class={`absolute top-20% left-50% translate-x--50%`}>
          <span>{props.text}</span>
        </div>
    );
  },
});

const genDivElement = () => document.createElement('div');

export const showMessage = (text: string, type: 'success' | 'error' | 'warning' = 'success') => {
  const el = genDivElement();
  const vNode = createVNode(MessageConstructor, { text, type });
  render(vNode, el);
  // second
  // createApp(MessageConstructor, {text, type}).mount(el);
  document.body.appendChild(el.firstElementChild as HTMLElement);
}

