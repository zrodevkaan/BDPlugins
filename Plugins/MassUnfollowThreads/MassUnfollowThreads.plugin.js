/**
 * @name MassUnfollowThreads
 * @version 1.0.1
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
  constructor()
  {
    this.name = MassUnfollowThreads.name
    this.version = '1.0.1'
    this.githubOwner = "ImAFrogOwO"
  }
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
    // console.log(GetThreadsFromParent()) >> I forgot i need to add context menu. xD

    this.MassUnfollowThreadsContext = ContextMenu.patch(
      "channel-context",
      (res, props) => {
        const ChannelId = props.channel.id;
        const GuildId = props.channel.guild_id;
        const Flags = props.channel.flags;
        if (Flags == 16) {
          const ButtonGroup = ContextMenu.buildItem({
            type: "button",
            label: "Leave All",
            onClick: () => {
              const Threads = Object.values(GetActiveThreads(GuildId, ChannelId));
              let index = 0;
    
              const leaveThreadInterval = setInterval(() => {
                if (index < Threads.length) {
                  const ChannelData = GetChannel(Threads[index].channel.id);
                  LeaveThread(ChannelData, "Context Menu");
                  index++;
                } else {
                  clearInterval(leaveThreadInterval);
                }
              }, 2000);
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
