# Python Blockchain Code

## Structure Overview
The code is available in both `.ipynb` (Jupyter Lab) and `.py` formats. The Jupyter Lab files refer to the `supply_chain` program, which utilizes previously defined `supply_chain` functions. The `.py` versions provide a clearer view for analysis in standard text editors.

Additionally, several `.py` modules relate to the blockchain's core structure.

---

## Blockchain Modules
There are **6 main modules**:

1. **`utils.py`**: Simulates the transaction time.
2. **`encrypt_data.py`**: Generates encrypted data by creating keys.
3. **`config.py`**: Defines the number of transactions per block.
4. **`transactions.py`**: Handles transaction signing, verification, and hashing.
5. **`block.py`**: Manages block creation.
6. **`blockchain.py`**: Adds new blocks and extends the blockchain.

---

## Supply Chain Implementation
After the blockchain is set up, transactions are defined using supply chain functions, organized into **6 `.ipynb` modules** (duplicated in `.py` format):

1. **`roles.ipynb`**:
   - Defines and assigns supply chain roles: supplier, manufacturer, logistic, retailer, and consumer.
   
2. **`products.ipynb`**:
   - Creates new products, with the supplier acting as the first role in the chain.

3. **`supply_chain.ipynb`**:
   - Integrates the blockchain with previously defined roles and products.

4. **`simulation.ipynb`**:
   - Defines the number of roles, origins, and products. Simulates the supply chain, where each transaction is recorded into a block.

5. **`visualization.ipynb`**:
   - **Previous version** used to generate visualizations (e.g., Gantt charts, blockchain structure, and network graphs).

6. **`app.ipynb`**:
   - Fully implemented interface to view all graphics and results. To inspect the complete blockchain, the user should access the local host.

---
