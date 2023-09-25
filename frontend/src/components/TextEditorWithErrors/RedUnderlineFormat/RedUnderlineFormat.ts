import { Quill } from "react-quill";

import classes from "./RedUnderlineFormat.module.scss";

const Underline = Quill.import("formats/underline");

class RedUnderline extends Underline {}

RedUnderline.blotName = "redU";
RedUnderline.className = classes.myCustomUnderline;
RedUnderline.tagName = "redU";

Quill.register(RedUnderline);
