import { defineComponent, watch, ref } from "vue";
import "@/assets/scss/components/playground/preview.scss";
import { useDebounce } from "@/hooks/useDebounce";
import { isDark } from "@/configs";
export default defineComponent({
  name: "Preview",
  props: {
    html: {
      type: String,
      default: "",
    },
    script: {
      type: String,
      default: "",
    },
    style: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const srcDoc = ref("");
    function getBackground() {
      return getComputedStyle(document.body).backgroundColor;
    }
    function getColor() {
      return getComputedStyle(document.body).color;
    }

    const updateSrcDoc = () => {
      srcDoc.value = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/vite.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>test</title>
          <style>
            html,body {
              color: ${getColor()};
              background-color: ${getBackground()};
            }
          </style>
          <style>
            ${props.style}
          </style>
        </head>
        <body>
          <div id="app">
            ${props.html}
          </div>
          <script type="module">
            ${props.script}
          </script>
        </body>
      </html>
    `;
    };
    const updateSrcDebounce = useDebounce(updateSrcDoc);
    watch([() => props.html, () => props.script, () => props.style], () => {
      updateSrcDebounce();
    });
    watch(() => isDark.value, updateSrcDoc);
    return () => (
      <div class="preview w-full h-full">
        <iframe class="w-full h-full" srcdoc={srcDoc.value} />
      </div>
    );
  },
});
