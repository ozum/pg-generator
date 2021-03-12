/**
 * This converter is from: https://github.com/superj80820/mermaid-js-converter
 */

// MIT License

// Copyright (c) 2020 York lin

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/* eslint-disable no-param-reassign */
import Base64 from "js-base64";

/**
 * Converts given content's mermaid sections into SVG.
 *
 * @param input is the content to convert mermaid parts to svg.
 * @returns converted content.
 *
 * @see https://github.com/superj80820/mermaid-js-converter
 */
/* istanbul ignore next  */
export function mermaidToSVG(input: string): string {
  const link = false;
  const matchData = input.match(/```mermaid(.|\n)*?```/gm);
  if (matchData === null) return input;

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

  let changeMd = input;
  matchData.forEach((item: any, index: string | number) => {
    changeMd = changeMd.replace(item, jsonStrings[index as any] as string);
  });

  return changeMd;
}
