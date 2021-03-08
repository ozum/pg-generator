/**
 * This converter is from: https://github.com/superj80820/mermaid-js-converter
 */

/* eslint-disable no-param-reassign */
import Base64 from "js-base64";

export function mermaidToSVG(data: string, { link = false } = {}): string {
  const matchData = data.match(/```mermaid(.|\n)*?```/gm);
  if (matchData === null) return data;

  const jsonStrings = matchData
    .map((item: string) => item.replace("```mermaid", "").replace("```", ""))
    // Workaround for classdiagram
    .map((item: string) =>
      item.startsWith("\nclass") || item.startsWith("\ngantt") || item.startsWith("\nerDiagram") || item.startsWith("\njourney")
        ? item.substr(1, item.length - 1)
        : item
    )
    .map((item: any) =>
      item.replace(/\s*?\w+?\s+/, "").length === 0
        ? undefined
        : JSON.stringify({
            code: item,
            mermaid: {
              theme: "default",
            },
          })
    )
    .map((item: any) => {
      if (item === undefined) return "";
      const jsonString = Base64.encodeURI(item);
      return link
        ? `[![](https://mermaid.ink/svg/${jsonString})](https://mermaid-js.github.io/mermaid-live-editor/#/edit/${jsonString})`
        : `![](https://mermaid.ink/svg/${jsonString})`;
    });

  let changeMd = data;
  matchData.forEach((item: any, index: string | number) => {
    changeMd = changeMd.replace(item, jsonStrings[index as any] as string);
  });

  return changeMd;
}
