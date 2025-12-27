"use client";

import NextLink from "next/link";
import { forwardRef, type ComponentProps } from "react";

type LinkProps = ComponentProps<typeof NextLink>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    return <NextLink ref={ref} {...props} />;
  }
);
