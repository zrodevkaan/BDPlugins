/**
 * @name DMCallConfirmation
 * @author imafrogowo
 * @version 1.0.2
 * @description Gives you a confirmation for the people who accidentally do it. Twice.
 */
const { Patcher, Webpack, Utils } = BdApi;
const { Filters, getModule, getStore } = Webpack;
const { findInTree } = Utils;

class DMCallConfirmation {

    getUser = (id) => {
        return getModule(x => x.getUser).getUser(id);
    };

    start() {
        this.CallPatch = Patcher.instead(
            "DMCallConfirmation",
            getModule(x => x.call && x.ring),
            "call",
            (a, b, c) => {
                const channelId = b[0];
                const channelStore = getStore("ChannelStore");
                const channel = channelStore.getChannel(channelId);
                const recipients = channel.recipients;

                if (recipients.length > 0) {
                    const users = recipients.map(userId => this.getUser(userId));
                    const userNames = users.map(user => user.username).join(', ');

                    BdApi.showConfirmationModal(
                        `Calling ${userNames}`,
                        `Are you sure you want to call ${userNames}?`,
                        {
                            onConfirm: () => {
                                c(...b);
                            },
                        }
                    );
                } else { // recipients[0], which is you in a DM, a group, you just don't exist.
                    const hopefullyUserFromChannelId = recipients[0];
                    const ringingUser = this.getUser(hopefullyUserFromChannelId);

                    BdApi.showConfirmationModal(
                        `Calling ${ringingUser.username}`,
                        `Are you sure you want to call ${ringingUser.username}?`,
                        {
                            onConfirm: () => {
                                c(...b);
                            },
                        }
                    );
                }
            }
        );
    }

    stop() {
        if (this.CallPatch) {
            this.CallPatch();
        }
    }
}

module.exports = DMCallConfirmation;
