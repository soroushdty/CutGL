<xsl:stylesheet version="1.0" xmlns:gem="http://gem.yale.edu"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output media-type="html"/>

	<xsl:strip-space elements="gem:*"/>
	<xsl:template match="/">
		<html>
			<head>
				<style>
                    td.bord
                    { 
                    border-bottom: solid #000000;
                    }
                </style>
			</head>
			<body>
				<table align="center" width="700">
					<tr>
						<td>
							<h2>
								<font color="navy">
									<xsl:value-of select="//gem:GuidelineTitle"
									/>
								</font>
							</h2>
						</td>
					</tr>

					<tr>
						<td valign="top" width="548"> </td>
						<td valign="top" bgcolor="#ffffff" width="144"
							align="right"/>
					</tr>
				</table>
				<table
					style="width:700;border-style:solid;border-width:thin;border-color:#cccccc">

					<tr>
						<td valign="top">&#160;</td>
						<td valign="top">&#160;</td>
						<td valign="top">&#160;</td>
						<td valign="top">&#160;</td>
					</tr>
					<tr>
						<td colspan="2" valign="top">
							<b>RECOMMENDATIONS</b>
						</td>
						<td valign="top">&#160;</td>
						<td valign="top">&#160;</td>
					</tr>

					<xsl:for-each select="//gem:Recommendation">
						<tr>
							<td valign="top">&#160;</td>
							<td valign="top">&#160;</td>
							<td valign="top">&#160;</td>
							<td valign="top">&#160;</td>
						</tr>

						<tr>
							<td valign="top" colspan="4">
								<b>Recommendation</b>
								
							</td>
                                                        </tr>
                                                        <tr>
                                                                                                                                                         <td valign="top" colspan="4">
								
								<xsl:value-of select="text()"/>
							</td>
						</tr>
						<xsl:for-each select=".//.">
							<xsl:if test="name(.) = 'Conditional'">
								
						
							<xsl:if test="normalize-space(text()) !=''">
								<tr>
									<td valign="top" colspan="4">

										<table border="0" cellpadding="0"
										cellspacing="0">
										<tr>
										<td valign="top" width="50"/>
										<td valign="top" width="100">
										<b>Conditional:</b>
										</td>
										<td width="400" valign="top">
										<xsl:value-of
										select="text()"/>
										</td>
										<td width="150"/>
										</tr>


										</table>

									</td>
								</tr>
								<tr>
									<td valign="top" width="50"/>
									<td valign="top" width="300">
										<span style="font-size:12px">
										{Rec_<xsl:value-of select="../@id"/>:Cond_
										<xsl:value-of select="@id"/>}
										</span>
									</td>
								</tr>
							</xsl:if>
						</xsl:if>

						
								<xsl:if test="name(.) = 'Imperative'">
									
					
							<xsl:if test="normalize-space(text()) !=''">
								<tr>
									<td valign="top" colspan="4">
										<table border="0" cellpadding="0"
										cellspacing="0">
										<tr>
										<td valign="top" width="50"/>
										<td valign="top" width="100">
										<b>Imperative:</b>
										</td>

										<td width="400" valign="top">
										<xsl:value-of
										select="text()"/>
										</td>
										<td width="150"/>
										</tr>

										</table>
									</td>
								</tr>
								<tr>
									<td valign="top" width="50"/>
									<td valign="top" width="300">
										<span style="font-size:12px">
										{Rec_<xsl:value-of select="../@id"/>:Imp_
										<xsl:value-of select="@id"/>}
										</span>
									</td>
								</tr>
							</xsl:if>
								</xsl:if>
                                                                
                                                                <xsl:if test="name(.) = 'StatementOfFact'">
								
						
							<xsl:if test="normalize-space(text()) !=''">
								<tr>
									<td valign="top" colspan="4">

										<table border="0" cellpadding="0"
										cellspacing="0">
										<tr>
										<td valign="top" width="10"/>
										<td valign="top" width="140">
										<b>Statement Of Fact:</b>
										</td>
										<td width="400" valign="top">
										<xsl:value-of
										select="text()"/>
										</td>
										<td width="150"/>
										</tr>


										</table>

									</td>
								</tr>
								<tr>
									<td valign="top" width="50"/>
									<td valign="top" width="300">
										<span style="font-size:12px">
										{Rec_<xsl:value-of select="../@id"/>:SoF_
										<xsl:value-of select="@id"/>}
										</span>
									</td>
								</tr>
							</xsl:if>
						</xsl:if>
                                                                
                                                                
						</xsl:for-each>


					</xsl:for-each>


				</table>

			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
