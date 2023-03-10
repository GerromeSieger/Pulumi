import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const Vpc = new aws.ec2.Vpc("vpc-gerrome", {
    cidrBlock: "10.0.0.0/16",
    tags: {
        Name: "vpc-gerrome",
    },
});

const subnet = new aws.ec2.Subnet("subnet-1", {
    vpcId: Vpc.id,
    cidrBlock: "10.0.1.0/24",
    availabilityZone: "us-east-1a",
    tags: {
        Name: "subnet-1",
    },
});

const NetworkInterface = new aws.ec2.NetworkInterface("nic-server-1", {
    subnetId: subnet.id,
    privateIps: ["10.0.1.0"],
    tags: {
        Name: "nic-server-1",
    },
});

const SecurityGroup = new aws.ec2.SecurityGroup("security-group-1", { 
    description: "Allow SSH access from anywhere", 
    ingress: [{ 
        protocol: "tcp", 
        fromPort: 22, 
        toPort: 22, 
        cidrBlocks: ["0.0.0.0/0"],  // Allow SSH access from anywhere 

    }], 

    vpcId: Vpc.id, // Attach to the VPC created above  

 });  
 
const Instance = new aws.ec2.Instance("gerrome-server", {
    ami: "ami-005e54dee72cc1d00",
    instanceType: "t2.micro",
    networkInterfaces: [{
        networkInterfaceId: NetworkInterface.id,
        deviceIndex: 0,
    }],
    keyName : "gerrome-server-keypair",
	vpcSecurityGroupIds : [SecurityGroup .id ],    
    creditSpecification: {
        cpuCredits: "unlimited",
    },
});



