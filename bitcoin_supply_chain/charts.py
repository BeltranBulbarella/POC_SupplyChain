#!/usr/bin/env python
# coding: utf-8

# In[ ]:


# app.py

import plotly.graph_objects as go
import networkx as nx  # For network visualizations

def visualize_blockchain(blockchain):
    G = nx.DiGraph()
    labels = {}

    # Add nodes and edges
    for block in blockchain.chain:
        index = block.index
        G.add_node(index)
        labels[index] = f"Block {index}\nHash: {block.hash()[:6]}..."
        if index > 0:
            G.add_edge(index - 1, index)

    # Layout
    pos = nx.spring_layout(G)

    # Edges
    edge_x = []
    edge_y = []
    for edge in G.edges():
        x0, y0 = pos[edge[0]]
        x1, y1 = pos[edge[1]]
        edge_x.extend([x0, x1, None])
        edge_y.extend([y0, y1, None])

    edge_trace = go.Scatter(
        x=edge_x, y=edge_y,
        line=dict(width=2, color='gray'),
        hoverinfo='none',
        mode='lines')

    # Nodes
    node_x = []
    node_y = []
    node_text = []
    for node in G.nodes():
        x, y = pos[node]
        node_x.append(x)
        node_y.append(y)
        node_text.append(labels[node])

    node_trace = go.Scatter(
        x=node_x, y=node_y,
        mode='markers+text',
        text=node_text,
        textposition="bottom center",
        hoverinfo='text',
        marker=dict(
            color='skyblue',
            size=50,
            line_width=2))

    # Figure
    fig = go.Figure(data=[edge_trace, node_trace],
                    layout=go.Layout(
                        title='Blockchain Structure',
                        showlegend=False,
                        hovermode='closest'))
    return fig

def visualize_entity_network(products):
    G = nx.MultiDiGraph()
    for product in products.values():
        history = product.get_history()
        for i in range(len(history) - 1):
            source = history[i]['updated_by']
            target = history[i+1]['updated_by']
            G.add_edge(source, target, product=product.product_id)

    pos = nx.spring_layout(G)

    # Edges
    edge_traces = []
    for edge in G.edges(data=True):
        x0, y0 = pos[edge[0]]
        x1, y1 = pos[edge[1]]
        edge_traces.append(go.Scatter(
            x=[x0, x1, None], y=[y0, y1, None],
            line=dict(width=1, color='gray'),
            hoverinfo='text',
            mode='lines',
            text=f"Product: {edge[2]['product']}"))

    # Nodes
    node_x = []
    node_y = []
    node_text = []
    for node in G.nodes():
        x, y = pos[node]
        node_x.append(x)
        node_y.append(y)
        node_text.append(node)

    node_trace = go.Scatter(
        x=node_x, y=node_y,
        mode='markers+text',
        text=node_text,
        textposition="top center",
        hoverinfo='text',
        marker=dict(
            color='lightgreen',
            size=10,
            line_width=2))

    # Figure
    fig = go.Figure(data=edge_traces + [node_trace],
                    layout=go.Layout(
                        title='Network of Entities',
                        showlegend=False,
                        hovermode='closest'))
    return fig

def visualize_product_flow(products):
    sources = []
    targets = []
    values = []
    label_list = []

    for product in products.values():
        history = product.get_history()
        for i in range(len(history) - 1):
            source = history[i]['updated_by']
            target = history[i+1]['updated_by']
            if source not in label_list:
                label_list.append(source)
            if target not in label_list:
                label_list.append(target)
            sources.append(label_list.index(source))
            targets.append(label_list.index(target))
            values.append(1)

    fig = go.Figure(data=[go.Sankey(
        node=dict(
            pad=15,
            thickness=20,
            label=label_list,
            color="blue"),
        link=dict(
            source=sources,
            target=targets,
            value=values,
            color="lightblue"))])

    fig.update_layout(title_text="Product Flow Through Entities", font_size=10)
    return fig

def generate_gantt_chart_data(products_data):
    """Create a Plotly Gantt chart for product lifecycle."""
    df = []
    for product_id, product in products_data.items():
        history = product['history']
        for i, event in enumerate(history):
            # Parse the event date
            start_time = event['date']  # Assuming date is in ISO format
            if i + 1 < len(history):
                finish_time = history[i + 1]['date']
            else:
                # If it's the last event, add a small delta to the finish time
                from datetime import datetime, timedelta
                finish_time_dt = datetime.strptime(start_time, '%Y-%m-%dT%H:%M:%S') + timedelta(hours=1)
                finish_time = finish_time_dt.strftime('%Y-%m-%dT%H:%M:%S')
            df.append({
                'Task': product_id,
                'Start': start_time,
                'Finish': finish_time,
                'Resource': event['status']
            })

    # Assign colors to resources
    colors = {
        'Created': 'rgb(46, 137, 205)',
        'Manufactured': 'rgb(114, 44, 121)',
        'In Transit': 'rgb(198, 47, 105)',
        'Available for Sale': 'rgb(58, 149, 136)',
        'Purchased': 'rgb(107, 127, 135)'
    }
    fig = ff.create_gantt(
        df,
        index_col='Resource',
        show_colorbar=True,
        group_tasks=True,
        colors=colors,
        title='Product Lifecycle Gantt Chart'
    )
    fig.update_layout(
        xaxis_title='Time',
        yaxis_title='Products',
        height=600,
        margin=dict(l=50, r=50, t=50, b=50)
    )
    return fig

