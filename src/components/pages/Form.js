import React from 'react';
import { Form, Button, Grid } from "semantic-ui-react";
import InlineError from "../messages/InlineError";

function FormComponent (props) {
    return <Form onSubmit={(e) => props.onSubmit(e)} loading={props.loading}>
        <Grid columns={2} stackable>
            <Grid.Row>
                <Grid.Column>
                    <Form.Field error={!!props.errors.name}>
                        <label htmlFor="name">{props.errors.message}</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder={props.placeholder}
                            value={props.data.name}
                            onChange={props.onChange}
                        />
                        {props.errors.name && <InlineError text={props.errors.name} />}
                    </Form.Field>

                    <Grid.Row>
                        <Grid.Column>
                            <Button primary>Create</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button type="button" onClick={props.closePopup} secondary>Cancel</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Form>
};

export default FormComponent;