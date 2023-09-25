import classes from "src/styles/App.module.scss";

import { LanguagesEnum } from "@src/common/enums/languagesEnum.ts";
import { TextEditorWithErrors } from "@src/components/TextEditorWithErrors/TextEditorWithErrors.tsx";

import "@src/styles/reset.scss";

function App() {
  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <span className={classes.lang}>EN</span>
        <TextEditorWithErrors lang={LanguagesEnum.ENGLISH_GB} />
      </div>
      <div className={classes.row}>
        <span className={classes.lang}>FR</span>
        <TextEditorWithErrors lang={LanguagesEnum.FRENCH} />
      </div>
      <div className={classes.row}>
        <span className={classes.lang}>IT</span>
        <TextEditorWithErrors lang={LanguagesEnum.ITALIAN} />
      </div>
    </div>
  );
}

export default App;
