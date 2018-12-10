/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import ListOptions from './ListOptions';

const listHeader = (props) =>
    <div
        onDragOver={(e) => props.onDragOver(e)}
        onDrop={(e) => props.onDrop(e, props.list)}
        key={props.list.listId}>
        <div style={{
                width: "100%",
                display: "flex",
                background: "aliceblue",
                borderBottom: "1px solid pink",
                lineHeight: "2em",
                position: "relative"
            }}>
            <div style={{
                    textAlign: "center",
                    height: "34px",
                    width: "calc(100% - 30px)"
                }}
                draggable
                onDragStart={(e) => props.onDragStart(e, props.list)}>
                {props.list.name}
            </div>

            <ListOptions
                list={props.list}
                options={{ 
                    "Delete list": props.deleteList,
                    "Edit list": props.editList,
                    "Add card to list": props.addCardToList
                }} />
        </div>
    </div>


export default listHeader;