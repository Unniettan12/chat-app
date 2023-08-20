import { useChatContext } from "stream-chat-react";
import React, { useEffect, useState } from "react";

import { SearchIcon } from "../assets/SearchIcon";
import { ResultsDropdown } from "./";

const ChannelSearch = ({ setToggleContainer }) => {
  const { client, setActiveChannel } = useChatContext();
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [teamChannels, setTeamChannels] = useState([]);
  const [directChannels, setDirectChannels] = useState([]);

  useEffect(() => {
    if (!searchKey) {
      setTeamChannels([]);
      setDirectChannels([]);
    }
  }, [searchKey]);

  const getChannels = async (text) => {
    try {
      const channelResponse = client.queryChannels({
        type: "team",
        name: { $autocomplete: text },
        members: { $in: [client.userID] },
      });

      const userResponse = client.queryUsers({
        id: { $ne: client.userID },
        name: { $autocomplete: text },
      });

      const [channels, { users }] = await Promise.all([
        channelResponse,
        userResponse,
      ]);

      if (channels.length) setTeamChannels(channels);
      if (users.length) setDirectChannels(users);
    } catch (error) {
      setSearchKey("");
    }
  };

  const onSearch = (event) => {
    event.preventDefault();
    setLoading(true);
    setSearchKey(event.target.value);
    getChannels(event.target.value);
  };

  const setChannel = (channel) => {
    setSearchKey("");
    setActiveChannel(channel);
  };

  return (
    <div className="channel-search__container">
      <div className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <SearchIcon />
        </div>
        <input
          className="channel-search__input__text"
          placeholder="Search"
          type="text"
          value={searchKey}
          onChange={onSearch}
        />
      </div>
      {searchKey && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          loading={loading}
          setSearchKey={setSearchKey}
          setToggleContainer={setToggleContainer}
          setChannel={setChannel}
        />
      )}
    </div>
  );
};
export default ChannelSearch;
