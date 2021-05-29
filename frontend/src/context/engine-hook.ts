import { createContext } from "react";
import { ChineseCheckersEngine } from "../engine/engine";

export const engine = new ChineseCheckersEngine(4);
export const EngineContext = createContext(engine);
