import React from 'react';
import { newContextComponents } from "drizzle-react-components";

import "../index.css";

const { ContractForm } = newContextComponents;

const Bank = ({ drizzle, drizzleState, approve }) => (((
    <div className="container">
        <div className="float-md-right">
            <button type="button" className="btn btn-success mt-3" onClick={approve}>Approve</button>
        </div>

        <div>
            {/* <div className="card">
                <div className="card-body">
                    <form >
                        <p className="h4 text-center py-4">Subscribe</p>

                        <label htmlFor="defaultFormCardNameEx" className="grey-text font-weight-light">Your name</label>
                        <input type="text" id="defaultFormCardNameEx" className="form-control" />

                        <br />
                        <label htmlFor="defaultFormCardEmailEx" className="grey-text font-weight-light">Your email</label>
                        <input type="email" id="defaultFormCardEmailEx" className="form-control" />

                        <div className="text-center py-4 mt-3">
                            <button className="btn btn-outline-purple" type="submit">Send<i className="fa fa-paper-plane-o ml-2"></i></button>
                        </div>
                    </form>
                </div>
            </div> */}

            {/* <h2 className="mt-5">Create Proposal here:</h2>
            <form >
                <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <input type="text" name="Type" className="form-control" id="type" placeholder="lending or borrowing" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="duration">Duration</label>
                    <input type="number" name="Duration" className="form-control" id="duration" placeholder="e.g 1 (in months)" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="interest">Interest</label>
                    <input type="number" name="Interest" className="form-control" id="interest" placeholder="e.g 5 (integer)" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Lending Amount</label>
                    <input type="number" name="Amount" className="form-control" id="amount" placeholder="Amount of ZST" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="collateral">Collateral Amount</label>
                    <input type="number" name="Collateral" className="form-control" id="collateral" placeholder="Amount of Ether" />
                </div>
                <input type="submit" value="Submit" />
            </form> */}
        </div>
    </div>

)));

export default Bank;