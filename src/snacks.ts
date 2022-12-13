import { showHUD, getPreferenceValues, getApplications, open, showToast, Toast } from "@raycast/api";
import fse from "fs-extra";
import slugify from "slugify";

interface Preferences {
  path: string;
}

interface Props {
  arguments: {
    Title: string;
  };
}
export default async function main(props: Props) {
  const now = new Date();
  const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const title = props.arguments.Title;
  const template = `---
title: "${title}"
published: true
description: ""
date: ${date}
layout: layouts/snacks.njk
tags: snacks
---`;
  const preferences = getPreferenceValues<Preferences>();
  const path = preferences.path + "/snacks/";

  if (fse.existsSync(path)) {
    const filename = `${slugify(title).toLowerCase()}.md`;
    fse.writeFileSync("/tmp/" + filename, template);
    fse.copyFileSync("/tmp/" + filename, path + filename);
    await showHUD(`Created file  ${path + filename}`);

    const applications = await getApplications();
    const visualStudioCode = applications.find((app) => app.bundleId === "com.microsoft.VSCode");

    if (!visualStudioCode) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Visual Studio Code is not installed",
        primaryAction: {
          title: "Install Visual Studio Code",
          onAction: () => open("https://code.visualstudio.com/download"),
        },
      });
      return;
    }

    await open(path + filename, visualStudioCode);
  } else {
    showHUD(`Path does not exist ${path}`);
  }
}
