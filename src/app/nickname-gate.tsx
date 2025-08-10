"use client"

import dynamic from 'next/dynamic'
const GateInner = dynamic(() => import('./nickname-gate/inner'))

export default function NicknameGate() {
  return <GateInner />
}


