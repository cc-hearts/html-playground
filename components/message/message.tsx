
import '@/assets/scss/components/message.scss';
import { noop } from '@cc-heart/utils';
import { PropType, Transition, createApp, defineComponent } from 'vue';
import CheckIcon from '../icons/check-icon.vue';
export const MessageConstructor = defineComponent({
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
    onAnimationEnd: {
      type: Function,
      default: noop
    }
  },
  setup(props, { expose }) {
    const visible = ref(true)

    const onClose = () => {
      visible.value = false
    }

    expose({ onClose })

    const emitAnimationEnd = () => {
      props.onAnimationEnd?.()
    }
    return () => {
      return <Transition name="msg" onAfterLeave={emitAnimationEnd}>
        {
          visible.value ? <div class={` absolute top-20px left-50% z-2 translate-x--50% rounded-lg p-x-12px bg-white p-y-6px message-box`}>
            <span class="m-r-8px align-sub translate-y--1px">
              <CheckIcon />
            </span>
            <span>{props.text}</span>
          </div> : null
        }
      </Transition>
    }
  },
});

const genDivElement = () => document.createElement('div');

type MessageType = 'success' | 'error' | 'warning';

export const showMessage = (text: string, type: MessageType = 'success', delay = 3000) => {
  const el = genDivElement();

  // createVNode: TODO: The component could not be destroyed
  // const vNode = createVNode(MessageConstructor, {
  //   text, type
  // });
  // render(vNode, el);

  const vNode = createApp(MessageConstructor, { text, type, onAnimationEnd: () => vNode.unmount() })
  vNode.mount(el);
  document.body.appendChild(el.firstElementChild as HTMLElement);
  setTimeout(() => {
    vNode._instance?.exposed?.onClose()
  }, delay)
}

