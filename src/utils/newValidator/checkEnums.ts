import { needExist } from '.';

interface ICheckEnums {
  enumType: { [key: string]: string };
  value: string;
  label: string;
}

export function checkEnums(data: ICheckEnums[]) {
  data.forEach(({ enumType, label, value }) => {
    const isValid = enumType[value];
    needExist([{ label, variable: isValid }]);
  });
}
