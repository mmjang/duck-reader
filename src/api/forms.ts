let formsData: { [key: string]: string[] };

export const forms = {
  async init() {
    if (!formsData) {
      formsData = await fetch(
        "https://cdn.jsdelivr.net/gh/mmjang/dict_hub@main/hub/forms.map.json"
      ).then((r) => r.json());
    }
  },
  async getBaseForms(word: string): Promise<string[]> {
    await forms.init();
    const formsArr = formsData[word.toLowerCase()];
    return formsArr || [];
  },
};
