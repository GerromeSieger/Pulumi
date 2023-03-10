import pulumi
import pulumi_azure as azure

resource_group = azure.core.ResourceGroup("GerromeResourceGroup", location="East US")

virtual_network = azure.network.VirtualNetwork("VNET1",
    address_spaces=["10.0.0.0/16"],
    location = resource_group.location,
    resource_group_name = resource_group.name)

subnet = azure.network.Subnet("Subnet-1",
    resource_group_name = resource_group.name,
    virtual_network_name = virtual_network.name,
    address_prefixes=["10.0.2.0/24"])

network_interface = azure.network.NetworkInterface("nic-1",
    location = resource_group.location,
    resource_group_name = resource_group.name,
    ip_configurations = [azure.network.NetworkInterfaceIpConfigurationArgs(
        name = "internal",
        subnet_id = subnet.id,
        private_ip_address_allocation = "Dynamic",
    )])

linux_virtual_machine = azure.compute.LinuxVirtualMachine("gerrome-server-linux",
    resource_group_name = resource_group.name,
    location = resource_group.location,
    size = "Standard_F2",
    admin_username = "victor",
    network_interface_ids = [network_interface.id],
    admin_ssh_keys = [azure.compute.LinuxVirtualMachineAdminSshKeyArgs(
        username = "victor",
        public_key = (lambda path: open(path).read())("C:/Users/victor/.ssh/azurevmkey.pub"),
    )],
    os_disk = azure.compute.LinuxVirtualMachineOsDiskArgs(
        caching = "ReadWrite",
        storage_account_type = "Standard_LRS",
    ),
    source_image_reference = azure.compute.LinuxVirtualMachineSourceImageReferenceArgs(
        publisher = "Canonical",
        offer = "UbuntuServer",
        sku = "16.04-LTS",
        version = "latest",
    ))