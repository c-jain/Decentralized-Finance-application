import React from 'react';

import "../index.css";
import { it } from 'ethers/wordlists';

const ListProposalsUI = ({ drizzle, drizzleState, proposals, decimal, changeStatus, status, accept, cancel, liquidate }) => (((
    <div>
        <div className="" style={{width: '100%', display: 'inline-block'}}>
            <button type="button" className="float-md-right btn btn-success mt-3 mr-3" onClick={changeStatus}>{status}</button>
        </div>
        
        <div className="container-fluid mt-5">
            <ul className="list-group">
                {
                    status === 'Unaccepted' &&
                    proposals.map(item => {
                        const creator = item.proposalType === 0 ? item.lender : item.borrower;
                        return <div key={parseInt(item.id._hex)}>
                                    {
                                        item.status === 0 &&
                                        <div >
                                            <li className="list-group-item list-group-item-action list-group-item-light d-lg-flex text-break">
                                                <div className="font-weight-bold text-secondary flex-lg-fill">Type: <span className="text-success">{item.proposalType === 0 ? "Lend" : "Borrow"}</span></div>
                                                <div className="font-weight-bold text-secondary flex-lg-fill">Proposal ID: <span className="text-success">{parseInt(item.id._hex, 16)}</span></div>
                                                <div className="font-weight-bold text-secondary flex-lg-fill">Lending Amt: <span className="text-success">{parseInt(item.amount._hex, 16)/(10**decimal)}</span> ZST</div>
                                                <div className="font-weight-bold text-secondary flex-lg-fill">Collateral Amt: <span className="text-success">{parseInt(item.collateralAmount._hex, 16)/(10**decimal)}</span> ether</div>
                                                <div className="font-weight-bold text-secondary flex-lg-fill">Duration: <span className="text-success">{parseInt(item.duration._hex, 16)}</span> M</div>
                                                <div className="font-weight-bold text-secondary flex-lg-fill">Monthly Pay: <span className="text-success">{((parseInt(item.amount._hex, 16) * parseInt(item.interest._hex, 16))/100)/(10**(decimal))}</span> ZST @<span className="text-success">{parseInt(item.interest._hex, 16)}</span>%</div>
                                                {
                                                    creator !== drizzleState.accounts[0] &&
                                                    <button className="btn btn-outline-success mr-2" onClick={() => accept(parseInt(item.id._hex, 16))}>Accept</button>
                                                }
                                                {
                                                    creator === drizzleState.accounts[0] &&
                                                    <button className="btn btn-outline-danger" onClick={() => cancel(parseInt(item.id._hex, 16))}>Delete</button>
                                                }                                                                                
                                            </li>
                                            <br/>
                                        </div>
                                    }
                                </div>
                    })
                }
                {
                    status === 'Accepted' &&
                    proposals.map(item => {
                        const timepassed = Math.floor(Date.now() / 1000) - parseInt(item.acceptTime._hex, 16);
                        const agreementDuration = parseInt(item.duration._hex, 16) * 30 * 24 * 60 * 60;
                        const safeDuration = (parseInt(item.totalMonthlyPaymentCompleted._hex, 16) * 30 + 30) * 24 * 60 * 60;
                        return <div key={parseInt(item.id._hex)}>
                                    {
                                        item.status === 1 &&
                                        <div>
                                            <li className="list-group-item list-group-item-action list-group-item-light d-lg-flex text-break flex-column">
                                                <div className="font-weight-bold text-secondary">Lender: <span className="text-success">{item.lender}</span></div>
                                                <div className="font-weight-bold text-secondary">Borrower: <span className="text-success">{item.borrower}</span></div>
                                                <div className="font-weight-bold text-secondary">Proposal ID: <span className="text-success">{parseInt(item.id._hex, 16)}</span></div>
                                                <div className="font-weight-bold text-secondary">Lending Amt: <span className="text-success">{parseInt(item.amount._hex, 16)/(10**decimal)}</span> ZST</div>
                                                <div className="font-weight-bold text-secondary">Collateral Amt: <span className="text-success">{parseInt(item.collateralAmount._hex, 16)/(10**decimal)}</span> ether</div>
                                                <div className="font-weight-bold text-secondary">Duration: <span className="text-success">{parseInt(item.duration._hex, 16)}</span> M</div>
                                                <div className="font-weight-bold text-secondary">Monthly Pay: <span className="text-success">{((parseInt(item.amount._hex, 16) * parseInt(item.interest._hex, 16))/100)/(10**(decimal))}</span> ZST @<span className="text-success">{parseInt(item.interest._hex, 16)}</span>%</div>
                                                <div className="font-weight-bold text-secondary">Monthly Pay Completed: <span className="text-success">{parseInt(item.totalMonthlyPaymentCompleted._hex, 16)}</span></div>
                                                {
                                                    (timepassed > agreementDuration || timepassed > safeDuration) &&
                                                    <button className="btn btn-outline-danger" onClick={() => liquidate(parseInt(item.id._hex, 16))}>Liquidate</button>
                                                }
                                            </li>
                                            <br/>
                                        </div>
                                    }
                                </div>
                    })
                }
            </ul>
        </div>
    </div>
)));

export default ListProposalsUI;