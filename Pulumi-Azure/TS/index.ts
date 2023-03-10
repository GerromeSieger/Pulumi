import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure";
import * as fs from "fs";

const ResourceGroup = new azure.core.ResourceGroup("VicResourceGroup", {location: "East US"});

const VirtualNetwork = new azure.network.VirtualNetwork("VNET1", {
    addressSpaces: ["10.0.0.0/16"],
    location: ResourceGroup.location,
    resourceGroupName: ResourceGroup.name,
});

const Subnet = new azure.network.Subnet("Subnet-1", {
    resourceGroupName: ResourceGroup.name,
    virtualNetworkName: VirtualNetwork.name,
    addressPrefixes: ["10.0.2.0/24"],
});

const NetworkInterface = new azure.network.NetworkInterface("Nic1", {
    location: ResourceGroup.location,
    resourceGroupName: ResourceGroup.name,
    ipConfigurations: [{
        name: "internal",
        subnetId: Subnet.id,
        privateIpAddressAllocation: "Static",
    }],
});

const LinuxVirtualMachine = new azure.compute.LinuxVirtualMachine("gerrome-linux-server", {
    resourceGroupName: ResourceGroup.name,
    location: ResourceGroup.location,
    size: "Standard_B1s",
    adminUsername: "victor",
    networkInterfaceIds: [NetworkInterface.id],
    adminSshKeys: [{
        username: "victor",
        publicKey: fs.readFileSync("C:/Users/victor/.ssh/azurevmkey.pub", "utf8"),
    }],
    osDisk: {
        caching: "ReadWrite",
        storageAccountType: "Standard_LRS",
    },
    sourceImageReference: {
        publisher: "Canonical",
        offer: "UbuntuServer",
        sku: "18.04-LTS",
        version: "latest",
    },
});