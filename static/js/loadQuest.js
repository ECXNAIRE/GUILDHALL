import { worldCanvas, worldCtx } from "./canvas.js";
import { state } from "./state.js";
import { questLayout } from "./drawQuest.js";


export async function loadQuest(guild) {
    const response = await fetch(`/getQuest/${guild}`);
    const quests = await response.json();

    state.quests = questLayout(quests)

    console.log(state.quests[0]);
    console.log(state.quests[1]);

}



