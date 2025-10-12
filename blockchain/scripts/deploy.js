import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  // Get contract factory
  const HealthRecord = await ethers.getContractFactory("HealthRecord");

  // Deploy contract
  const healthRecord = await HealthRecord.deploy();

  // Wait for deployment
  await healthRecord.waitForDeployment();

  console.log("HealthRecord deployed to:", await healthRecord.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
