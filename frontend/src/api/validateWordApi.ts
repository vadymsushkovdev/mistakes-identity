import axios from "axios";

import { LanguagesEnum } from "@src/common/enums/languagesEnum.ts";

type ValidationResponse = {
  original: string;
  suggestions: string[];
};

export const validateWordApi = async (
  text: string,
  lang: LanguagesEnum,
): Promise<ValidationResponse[]> => {
  try {
    const { data } = await axios.post(`http://localhost:3020/`, { text, lang });

    return data;
  } catch (e) {
    throw new Error();
  }
};
