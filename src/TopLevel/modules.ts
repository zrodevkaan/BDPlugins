export const modules: Record<string, any> = {};

BdApi.Utils.forceLoad([828062, 622168]).then((raw) => {
    modules.myModule = raw[828062].default;
    modules.otherModule = raw[622168].default;
});