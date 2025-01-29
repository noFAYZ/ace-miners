import { configureChains, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient } = configureChains(
    [mainnet, sepolia],
    [publicProvider()]
)

export const config = createConfig({
    autoConnect: true,
    publicClient,
    chains
})