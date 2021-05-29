import * as fs from "fs";
import prettier from "prettier";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import ErrorPage from "../src/components/UI/Error/ErrorPage";
import Content from "../src/components/UI/Layout/Content";
import {
  ServerStyleSheets,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
import { ThemeProvider } from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import GlobalStyle from "../src/styles/global";
import theme from "../src/styles/theme";
import { ERROR_PAGE_GENERAL_TITLE } from "../src/config/Constants";

function renderFullPage(html, css, css2) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Error page" />
        <title>Error</title>
        <style id="mui-styles">${css}</style>
        ${css2}
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `;
}

export function CustomErrorPage(props) {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyle />
        <Content>
          <ErrorPage
            title={`${ERROR_PAGE_GENERAL_TITLE} ${props.status}`}
            description={props.body}
            isReturn
          />
        </Content>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

async function readJSONFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, jsonString) => {
      if (err) {
        console.log("Error reading file from disk:", err);
        reject;
        return;
      }
      try {
        const errors = JSON.parse(jsonString);
        resolve(errors);
      } catch (err) {
        console.log("Error parsing JSON string:", err);
        reject;
      }
    });
  });
}

function createDirectory(directory) {
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
      console.log("Directory is created.");
    } else {
      console.log("Directory already exists.");
    }
  } catch (err) {
    console.log(err);
  }
}

function createStaticErrorPage(error) {
  const styledSheet = new ServerStyleSheet();
  const muiSheets = new ServerStyleSheets();

  try {
    const html = ReactDOMServer.renderToString(
      styledSheet.collectStyles(
        muiSheets.collect(
          <CustomErrorPage status={error.status} body={error.body} />
        )
      )
    );
    const muiCss = muiSheets.toString();
    const styledStyle = styledSheet.getStyleTags();

    let htmlWithStyles = renderFullPage(html, muiCss, styledStyle);

    let prettyHtml = prettier.format(htmlWithStyles, { parser: "html" });
    let outputFile = `./src/errors/${error.status}.html`;
    fs.writeFileSync(outputFile, prettyHtml);
    console.log(`Wrote ${outputFile}`);
  } catch (error) {
    console.error(error);
  } finally {
    styledSheet.seal();
  }
}

createDirectory("./src/errors");
readJSONFile("./scripts/error-data.json").then((errors) =>
  errors.forEach((error) => createStaticErrorPage(error))
);
