import { Splitpanes, Pane } from 'splitpanes'
import {
  Ref,
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  nextTick,
  watch,
} from 'vue'
import '@/assets/scss/components/playground/playground.scss'
import CodeMirror from '@/components/codeMirror/index.vue'
import Preview from './preview'
import { RemoveIcon } from '@/icons'
import Card from '@/components/Card/Container'
import Add from '@/icons/add.vue'
import { transFormCode } from './compileApi'
import { useDebounce } from '@/hooks/useDebounce'
export default defineComponent({
  name: 'Playground',
  setup() {
    const entry = 'app.js'
    const html = ref('')
    const addScriptTagRef = ref<HTMLInputElement | null>(null)
    const isAddScriptVisible = ref(false)
    const style = ref('')
    const scriptModule = reactive(new Map())
    scriptModule.set(entry, `// ${entry}`)
    const currentPage = ref(entry)
    const handleChange = (event: string, refs: Ref<string>) => {
      refs.value = event
    }
    const script = computed(() => {
      return scriptModule.get(currentPage.value) || ''
    })

    const scriptNames = computed(() => [...scriptModule.keys()])
    const compileModule = ref({})

    const handleChangeCompileModule = useDebounce(async () => {
      const newCode = await transFormCode(Object.fromEntries(scriptModule))
      Reflect.set(compileModule, 'value', newCode)
    }, 500)
    const handleChangeScripts = async (event: string) => {
      scriptModule.set(currentPage.value, event)
      handleChangeCompileModule()
    }

    const handleBlur = (event: Event) => {
      isAddScriptVisible.value = false
      let value: string = Reflect.get(event.target || {}, 'value')
      if (value) {
        if (!value.endsWith('.js')) {
          value += '.js'
        }
        scriptModule.set(value, `// ${value}`)
      }
    }

    const handleRemoveTag = (name: string, e: MouseEvent) => {
      if (scriptModule.has(name)) {
        if (currentPage.value === name) {
          const ind = scriptNames.value.findIndex((val) => val === name)
          if (ind !== 0) {
            currentPage.value = scriptNames.value[ind - 1]
          }
        }
        scriptModule.delete(name)
        handleChangeCompileModule()
        e.stopPropagation()
      }
    }

    watch(
      () => isAddScriptVisible.value,
      (bool) => {
        if (bool) {
          nextTick(() => {
            const el = addScriptTagRef.value
            if (el) {
              el.focus?.()
            }
          })
        }
      },
    )

    const handlerKeydownEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleBlur(e)
    }

    const handleChangeCurrentScripts = (name: string) => {
      currentPage.value = name
    }

    onMounted(() => {
      handleChangeCompileModule()
    })

    return () => (
      <div class="p-3 w-full h-full">
        <Splitpanes class="default-theme">
          <Pane>
            <Splitpanes class="default-theme" horizontal>
              <Pane>
                <Card v-slots={{ title: () => 'html' }}>
                  <CodeMirror
                    value={html.value}
                    lang="html"
                    onChange={(e) => handleChange(e, html)}
                  />
                </Card>
              </Pane>
              <Pane>
                <Card
                  v-slots={{
                    title: () => (
                      <div class="flex items-center">
                        <div>
                          {scriptNames.value.map((val) => {
                            return (
                              <span
                                onClick={() => handleChangeCurrentScripts(val)}
                                class={`script-tag relative ${
                                  currentPage.value === val
                                    ? 'active-script'
                                    : ''
                                }`}
                              >
                                {val}
                                {val === 'app.js' ? null : (
                                  <RemoveIcon
                                    class="absolute top-3px right--2px"
                                    onClick={(e: MouseEvent) =>
                                      handleRemoveTag(val, e)
                                    }
                                  />
                                )}
                              </span>
                            )
                          })}
                        </div>
                        {isAddScriptVisible.value && (
                          <input
                            ref={(ref) => {
                              if (ref instanceof HTMLInputElement)
                                addScriptTagRef.value = ref
                            }}
                            autofocus
                            class="add-script-tag"
                            onBlur={handleBlur}
                            onKeypress={handlerKeydownEnter}
                          ></input>
                        )}
                        <Add
                          onClick={() => (isAddScriptVisible.value = true)}
                        />
                      </div>
                    ),
                  }}
                >
                  <CodeMirror
                    value={script.value}
                    onChange={(e) => handleChangeScripts(e)}
                  />
                </Card>
              </Pane>
              <Pane>
                <Card v-slots={{ title: () => 'style' }}>
                  <CodeMirror
                    value={style.value}
                    lang="css"
                    onChange={(e) => handleChange(e, style)}
                  />
                </Card>
              </Pane>
            </Splitpanes>
          </Pane>
          <Pane>
            <Card v-slots={{ title: () => 'output' }}>
              <Preview
                compileModule={compileModule.value}
                entry={entry}
                html={html.value}
                style={style.value}
              />
            </Card>
          </Pane>
        </Splitpanes>
      </div>
    )
  },
})
