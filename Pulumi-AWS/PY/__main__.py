import pulumi
import pulumi_aws as aws

Vpc = aws.ec2.Vpc("Vpc-1",
    cidr_block = "10.0.0.0/16",
    tags = {
        "Name": "Vpc-1",
    })

Subnet = aws.ec2.Subnet("Subnet-1",
    vpc_id = Vpc.id,
    cidr_block = "10.0.1.0/24",
    availability_zone = "us-west-2a",
    tags={
        "Name": "Subnet-1",
    })

Network_interface = aws.ec2.NetworkInterface("Nic1",
    subnet_id = Subnet.id,
    private_ips = ["10.0.1.0"],
    tags={
        "Name": "primary_network_interface",
    })

Instance = aws.ec2.Instance("gerrome-server",
    ami = "ami-005e54dee72cc1d00",
    instance_type = "t2.micro",
    network_interfaces = [aws.ec2.InstanceNetworkInterfaceArgs(
        network_interface_id = Network_interface.id,
        device_index=0,
    )],
    credit_specification=aws.ec2.InstanceCreditSpecificationArgs(
        cpu_credits="unlimited",
    ))