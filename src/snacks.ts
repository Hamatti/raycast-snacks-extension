import { showHUD, getPreferenceValues } from "@raycast/api";
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
  } else {
    showHUD(`Path does not exist ${path}`);
  }
}
