# app.py

from dash import Dash, dcc, html
from dash.dependencies import Input, Output, State
from simulation import run_simulation
import visualization  # Import the visualization module

# Initialize the Dash app
app = Dash(__name__)

# Define the layout with input for number of products and tabs
app.layout = html.Div([
    html.H1("Supply Chain Simulation Dashboard"),
    
    # Input for number of products
    html.Div([
        html.Label("Number of Products:"),
        dcc.Input(id='num-products', type='number', value=10, min=1, max=100, step=1),
        html.Button('Run Simulation', id='run-simulation', n_clicks=0)
    ], style={'marginBottom': '20px', 'display': 'flex', 'alignItems': 'center'}),
    
    # Store simulation data
    dcc.Store(id='simulation-data', storage_type='memory'),
    
    # Tabs
    dcc.Tabs(id='tabs', value='product-flow', children=[
        dcc.Tab(label='Product Flow', value='product-flow'),
        dcc.Tab(label='Blockchain Structure', value='blockchain-structure'),
        dcc.Tab(label='Network of Entities', value='entity-network'),
        dcc.Tab(label='Product Lifecycle Gantt Chart', value='gantt-chart'),
    ]),
    html.Div(id='tabs-content')
])

# Callback to run the simulation and store data
@app.callback(
    Output('simulation-data', 'data'),
    Input('run-simulation', 'n_clicks'),
    State('num-products', 'value')
)
def run_simulation_callback(n_clicks, num_products):
    if n_clicks > 0:
        # Run the simulation with the specified number of products
        scm = run_simulation(num_products=num_products)
        products = scm.products
        blockchain = scm.blockchain

        # Serialize data
        # Convert products and blockchain into serializable formats
        products_data = {}
        for pid, product in products.items():
            products_data[pid] = {
                'product_id': product.product_id,
                'origin': product.origin,
                'current_holder': product.current_holder,
                'status': product.status,
                'history': product.history
            }
        blockchain_data = []
        for block in blockchain.chain:
            blockchain_data.append({
                'index': block.index,
                'timestamp': block.timestamp,
                'transactions': [t.data for t in block.transactions],
                'previous_hash': block.previous_hash,
                'nonce': block.nonce,
                'hash': block.hash()
            })

        data = {
            'products': products_data,
            'blockchain': blockchain_data
        }
        return data
    else:
        # No simulation data yet
        return {}

# Callback to render the content based on the selected tab and simulation data
@app.callback(
    Output('tabs-content', 'children'),
    Input('tabs', 'value'),
    State('simulation-data', 'data')
)
def render_content(tab, data):
    if data:
        products_data = data['products']
        blockchain_data = data['blockchain']

        if tab == 'product-flow':
            fig = visualization.visualize_product_flow_data(products_data)
            return html.Div([
                dcc.Graph(figure=fig)
            ])
        elif tab == 'blockchain-structure':
            fig = visualization.visualize_blockchain_data(blockchain_data)
            return html.Div([
                dcc.Graph(figure=fig)
            ])
        elif tab == 'entity-network':
            fig = visualization.visualize_entity_network_data(products_data)
            return html.Div([
                dcc.Graph(figure=fig)
            ])
        elif tab == 'gantt-chart':
            fig = visualization.visualize_gantt_chart_data(products_data)
            return html.Div([
                dcc.Graph(figure=fig)
            ])
    else:
        return html.Div([
            html.H3('Please run the simulation by specifying the number of products and clicking "Run Simulation".')
        ])

if __name__ == '__main__':
    app.run_server(debug=True)