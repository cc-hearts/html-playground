import { Splitpanes, Pane } from "splitpanes";
import { Ref, defineComponent, ref } from "vue";
import "@/assets/scss/components/playground/playground.scss";
import CodeMirror from "@/components/codeMirror/index.vue";
import Preview from "./preview";
import Card from "@/components/Card/Container";
export default defineComponent({
  name: "Playground",
  setup() {
    const html = ref("");
    const script = ref("");
    const style = ref("");
    const handleChange = (event: string, refs: Ref<string>) => {
      refs.value = event;
    };
    return () => (
      <div class="p-3 w-full h-full">
        <Splitpanes class="default-theme">
          <Pane>
            <Splitpanes class="default-theme" horizontal>
              <Pane>
                <Card v-slots={{ title: () => "html" }}>
                  <CodeMirror
                    value={html.value}
                    lang="html"
                    onChange={(e) => handleChange(e, html)}
                  />
                </Card>
              </Pane>
              <Pane>
                <Card v-slots={{ title: () => "script" }}>
                  <CodeMirror
                    value={script.value}
                    onChange={(e) => handleChange(e, script)}
                  />
                </Card>
              </Pane>
              <Pane>
                <Card v-slots={{ title: () => "style" }}>
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
            <Card v-slots={{ title: () => "output" }}>
              <Preview
                html={html.value}
                script={script.value}
                style={style.value}
              />
            </Card>
          </Pane>
        </Splitpanes>
      </div>
    );
  },
});
