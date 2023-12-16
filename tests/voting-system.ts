import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { createHash } from "crypto";
import { VotingSystem } from "../target/types/voting_system";

describe("voting-system", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const program = anchor.workspace.VotingSystem as Program<VotingSystem>;

  const site = "google.com";

  // anchor.web3.keypair
  const signer = Keypair.generate();

  const hash = createHash("sha256");

  hash.update(Buffer.from(site));

  const seeds = [hash.digest()];

  const vote = PublicKey.findProgramAddressSync(seeds, program.programId)[0];

  const confirm = async (signature: string) => {
    const confirmTx = async (signature: string) => {
      const latestBlockhash = await anchor.getProvider().connection.getLatestBlockhash();
      await anchor.getProvider().connection.confirmTransaction(
        {
          signature,
          ...latestBlockhash,
        },
        "confirmed"
      )
      return signature
    }}

  const log = async (signature: string) => {
    console.log(
      `https://explorer.solana.com/transaction/${signature}?cluster=custom`
    );
    return signature;
  };

  it("Airdrop", async () => {
    await provider.connection
      .requestAirdrop(signer.publicKey, LAMPORTS_PER_SOL * 10)
      .then(confirm)
      //.then(log);
  });

  xit("Initialize", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize(site)
      .accounts({
        signer: signer.publicKey,
        vote,
      })
      .signers([signer])
      .rpc()
      .then(confirm)
      .then(log);
    // console.log("Your transaction signature", tx);
  });

  it("Upvote", async () => {
    // Add your test here.
    const tx = await program.methods
      .upvote(site) 
      .accounts({
        signer: signer.publicKey,
        vote,
      })
      .signers([signer])
      .rpc()
      .then(confirm)
      .then(log);
    // console.log("Your transaction signature", tx);
  })
});

// anchor idl init 25fmHQTyrngRCzvUjaQhaMP1SEbZjHfJQx6e8oHcFX77 -f target/idl/voting_system.json