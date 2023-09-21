/**
 * @name MassUnfollowThreads
 * @description Allows you to leave many forums at once.
 */

const {
  React,
  ContextMenu,
  Patcher,
  UI,
  ReactUtils,
  findModuleByProps,
  ReactDOM,
  Webpack: { getStore, getModule },
} = BdApi;

class MassUnfollowThreads {
  start() {
    const LeaveThread = getModule((x) => x.leaveThread).leaveThread; // Make sure to pass "Context Menu" as parameter `1`
    const GetChannel = BdApi.Webpack.getModule((x) => x.getChannel).getChannel;

    // Where does the actual "Mass Unfollow Threads" come in? How do I even get the threads of a forum :((
    // FOUND ITT BdApi.Webpack.getModule(x=>x.getThreadsForParent).getThreadsForParent(guild_id ?,forum_id)

    const GetActiveThreads = (GuildId, ChannelId) =>
      getModule(
        (x) => x.getActiveJoinedThreadsForParent
      ).getActiveJoinedThreadsForParent(GuildId, ChannelId);
    // >> half way into this I realized getThreadsForParent had no active threads. get changed nerd.

    const SelectedGuildStore = findModuleByProps("getLastSelectedGuildId");
    const SelectedChannelStore = getStore(
      "SelectedChannelStore"
    ).__getLocalVars(); // Stole 27 - 28 from my MemberCountFix plugin.

    // console.log(GetThreadsFromParent()) >> I forgot i need to add context menu. xD

    this.MassUnfollowThreadsContext = ContextMenu.patch(
      "channel-context",
      (res, props) => {
        const ChannelId = props.channel.id;
        const GuildId = props.channel.guild_id;
        const Flags = props.channel.flags;
        if (Flags == 16) {
          // >> I think its a forum flag.
          const ButtonGroup = ContextMenu.buildItem({
            type: "button",
            label: "Leave All",
            onClick: () => {
              const Threads = Object.values(
                GetActiveThreads(GuildId, ChannelId)
              ); // >> REMEMBER. THIS GETS ACTIVE THREADS >> Changed method name.
              Threads.forEach((x) => {
                const ChannelData = GetChannel(x.channel.id);
                LeaveThread(ChannelData, "Context Menu");
              });
              // lets get COMPLICATED "Object.values(GetActiveThreads(GuildId, ChannelId)).forEach(thread => LeaveThread(GetChannel(thread.channel.id), "Context Menu"));"
            },
          });

          const Separator = ContextMenu.buildItem({ type: "separator" });

          res.props.children.push(Separator);
          res.props.children.push(ButtonGroup);
        }
      }
    );
  }
  stop() {
    this.MassUnfollowThreadsContext();
  }
}

module.exports = MassUnfollowThreads;
