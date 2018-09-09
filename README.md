## Bamazon Node Database

This node application utilizes MySQL and Inquire to allow a user to purchase items as a customer. As a manager see see all products for sale, view low inventoryu, add inventory, and add new products to the database. As a supervisor, it will allow you to see the the total sales of each department, and how much actual profit each department has made against the operating costs.

## Getting Started

(Please view the Prerequisite section first)

- Clone the repo or download the zip file to your desktop.
- Use node to get into the directory of the folder
- With vagrant and virtual box installed, type `vagrant up`
- After the VM is running successfully, type `npm install` to get all dependencies from `package.json`
- Once installed, type `vagrant ssh` to get into your VM, then navigate by typing `cd /var/code` to access the JS files.
- Simply run `node bamazonCustomer.js` or one of the other js files

### Prerequisites

In order to run this application locally you will need the latest versions of `node.js`, `MySQL workbench`, `vagrant`, and `virtual box` and a VM on your choice. This was created using an ubuntu vm.

### Functionality

Bamazon Customer (bamazonCustomer.js)

    Buy Product:
    [alt text](https://s15.postimg.cc/4bxbscgaz/cutsomer_buy.jpg "Customer Buy")

    **Unable to purchase zero quantity items**
    (https://s15.postimg.cc/eyr4xr90r/customer_insf_buy.jpg)

Bamazon Manager (bamazonManager.js)

    Manager Menu:
    1. (https://s15.postimg.cc/msrqikod7/manager_menu.jpg)

    View Products for Sale:
    (https://s15.postimg.cc/brwle36kb/manager_products.jpg)

    Check low inventory:
    1. (https://s15.postimg.cc/vb16mxabf/manager_lowinv.jpg)

    Add inventory to a product:
    1. (https://s15.postimg.cc/rq5b48vnf/manager_addinv.jpg)
    2. (https://s15.postimg.cc/5e7iav497/manager_addinv2.jpg)
    3. (https://s15.postimg.cc/djpk91fnf/manager_addinv3.jpg)

    Add new product:
    1. (https://s15.postimg.cc/ka61ig08b/manager_addprod.jpg)
    2. (https://s15.postimg.cc/7irvbydln/manager_addprod2.jpg)
    3. (https://s15.postimg.cc/eaiae8pkb/manager_addprod3.jpg)\

Bamazon Supervisor (bamazonSupervisor.js)

    Add new department
    (https://s15.postimg.cc/ojarklo23/supervisor_add_dept.jpg)

    View departments
    (https://s15.postimg.cc/s2wpaeyhn/supervisor_view_Products.jpg)

## Built With

- [Node.js](https://nodejs.org/en/)
- [Vagrant Up](https://www.vagrantup.com/)
- [Virtual Box](https://www.virtualbox.org/)
- [NPM Inquirer](https://www.npmjs.com/package/inquirer)
- [NPM CLI-Table](https://www.npmjs.com/package/cli-table)
