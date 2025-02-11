import styled from "@emotion/styled";
import useSocket from "@hooks/useSocket";
import { Avatar, Badge, Box, BoxProps, Typography } from "@mui/material";
import { FriendInformationType } from "@pages";
import { AppState } from "@stores";
import { useLazyGetUserByIdQuery } from "@stores/services/user";
import { theme } from "@theme";
import { ConversationType, UserType } from "@typing/common";
import { getLastWordOfString } from "@utils/common";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { omit } from "lodash";
import CATypography from "@components/Typography";

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    width: 10,
    height: 10,
    borderRadius: 9999,
    border: "2px solid #fff",
  },
}));

interface ConversationProps extends BoxProps {
  conversation: ConversationType;
  setFriendInformation: React.Dispatch<
    React.SetStateAction<FriendInformationType | null>
  >;
  onClick: () => void;
  isActive: boolean;
}

const Conversation = ({
  conversation,
  setFriendInformation,
  onClick,
  isActive,
  ...props
}: ConversationProps) => {
  const socket = useSocket();
  const { t } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const [friend, setFriend] = useState<UserType | null>(null);
  const [onlineUsers, setIsOnlineUsers] = useState<any>([]);
  const currentUserId = useSelector((state: AppState) => state.auth.id);

  useEffect(() => {
    socket?.current.on("getUsers", (users) => {
      setIsOnlineUsers(users);
       console.log("online users", users);
    });
  }, []);
  //conversation.members, currentUserId, socket
  const [getUserById] = useLazyGetUserByIdQuery();

  useEffect(() => {
    const friendId = conversation.members?.find((conv: string) => conv !== currentUserId);

    if (!friendId) {
      return;
    }

    getUserById({
      userId: friendId,
    })
      .unwrap()
      .then((response) => {
        setFriend(response);
      });
  }, [conversation.members, currentUserId, getUserById]);

  if (!friend) {
    return <></>;
  }

  return (
    <Box
      {...props}
      onClick={() => {
        onClick();
        setFriendInformation({
          name: friend.username,
          ...omit(friend, ["username"]),
        });
      }}
      sx={{
        p: 1.5,
        cursor: "pointer",
        transitionDuration: "0.3s",
        "&:hover": {
          bgcolor: darkMode ? theme.palette.darkTheme.light : theme.palette.grey[400],
          borderRadius: 0.5,
        },
        ...(isActive && {
          bgcolor: darkMode ? theme.palette.darkTheme.light : theme.palette.grey[400],
          borderRadius: 0.5,
          pointerEvents: "none",
        }),
      }}
      display="flex"
      overflow="hidden"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box mr={2}>
        <StyledBadge
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: onlineUsers?.some((user:any) => user.userId === friend?._id)
                ? "#44b700"
                : theme.palette.grey[700],
            },
          }}
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            src={friend?.avatar || "/images/avatar-default.svg"}
          />
        </StyledBadge>
      </Box>
      <Box flex={1}>
        <Typography
          color={darkMode ? theme.palette.common.white : undefined}
          fontWeight={600}
        >
          {friend.username}
        </Typography>
        {!!conversation?.lastMessage && (
          <CATypography
            sx={{
              width: 150,
            }}
            lineClamp={1}
            width={10}
            variant="caption"
            color={darkMode ? theme.palette.text.secondary : theme.palette.grey[600]}
          >
            {(conversation.lastMessage.id === currentUserId
              ? t("you")
              : `${getLastWordOfString(friend?.username)}: `) +
              conversation.lastMessage.text}
          </CATypography>
        )}
      </Box>
      <Box alignSelf="flex-start" mr={0.5}>
        {!!conversation?.lastMessage && (
          <Typography
            variant="caption"
            color={darkMode ? theme.palette.text.secondary : theme.palette.grey[600]}
          >
            {format(new Date(conversation.lastMessage.createdAt), "HH:mm")}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Conversation;
