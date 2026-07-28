import { worldCanvas, worldCtx } from "./canvas.js";
import { state } from "./state.js";
import { questLayout } from "./drawQuest.js";


export async function loadQuest(guild) {
    const response = await fetch(`/getQuest/${guild}`);
    const quests = await response.json();

    quests.forEach(quest => {
        quest.tags = JSON.parse(quest.tags);
    });

    state.quests = questLayout(quests)

}



