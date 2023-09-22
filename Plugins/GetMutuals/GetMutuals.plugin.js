/**
 * @name GetMutuals
 * @description Gives you all the people who are in a server who you are friends with
 * @author imafrogowo
 */

const {
  Webpack: { getModule, getStore },
  React,
  findModuleByProps,
  Patcher,
} = BdApi;

class GetMutuals {
  start() {}
  onSwitch() {
    const RelationshipStore = getStore("RelationshipStore");
    const GuildMemberStore = getStore("GuildMemberStore");
    const SelectedGuildStore = findModuleByProps("getLastSelectedGuildId");
    const UserModule = getModule((x) => x.getUser);

    const SelectedGuildId = SelectedGuildStore.getGuildId();
    const FriendUserIds = Object.keys(
      RelationshipStore.__getLocalVars().relationships
    );

    const MutualFriendsInSelectedGuild = [];
    const BlockedUsersInSelectedGuild = [];

    const IsFriend = (userId) => RelationshipStore.isFriend(userId);
    const IsBlocked = (userId) => RelationshipStore.isBlocked(userId);

    for (const UserId of FriendUserIds) {
      if (GuildMemberStore.isMember(SelectedGuildId, UserId)) {
        const UserData = UserModule.getUser(UserId);

        if (IsFriend(UserId)) {
          MutualFriendsInSelectedGuild.push(UserData.username);
        }

        if (IsBlocked(UserId)) {
          BlockedUsersInSelectedGuild.push(UserData.username);
        }
      }
    }

    console.log("Friends:", MutualFriendsInSelectedGuild);
    console.log("Blocked:", BlockedUsersInSelectedGuild);
  }
  stop() {}
}
