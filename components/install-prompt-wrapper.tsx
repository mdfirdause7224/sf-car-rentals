"use client"

import dynamic from "next/dynamic"

const InstallPrompt = dynamic(() => import("@/components/install-prompt"), {
  ssr: false,
})

export default function InstallPromptWrapper() {
  return <InstallPrompt />
}
