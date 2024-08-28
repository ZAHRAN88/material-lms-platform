'use client';

import React, { useEffect, useRef } from "react";
import useOnlineStatus from "./custom/UseOnlineStatus";
import toast from "react-hot-toast";

const OnlineStatus = () => {
  const isOnline = useOnlineStatus();
  const hasMounted = useRef(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (!isOnline) {
      toast.error("You are offline. Please check your internet connection. Try refreshing the page.");
      wasOffline.current = true;
    } else if (wasOffline.current) {
      toast.success("You are back online!!");
      wasOffline.current = false;
    }
  }, [isOnline]);

  
  return null;
};

export default OnlineStatus;
