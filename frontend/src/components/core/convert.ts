import { Hex } from "../../engine/hex.lib";

export const hexTypeArrayToHexArray = (hexTypes: HexType[]): Hex[] => {
  const hexs: Hex[] = [];
  hexTypes.forEach((hextype) => {
    hexs.push(new Hex(hextype.q, hextype.r, hextype.s));
  });

  return hexs;
};
