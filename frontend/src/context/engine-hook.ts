import { createContext } from "react";
import { ChineseCheckersEngine } from "../engine/engine";

export const engine = new ChineseCheckersEngine();
export const EngineContext = createContext(engine);
