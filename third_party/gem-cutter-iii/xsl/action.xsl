<xsl:stylesheet version="2.0" xmlns:gem="http://gem.yale.edu" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output media-type="html"/>
	<xsl:strip-space elements="gem:*"/>
	<xsl:template match="/">
		<html>
			<h2>
				<xsl:value-of select="//gem:GuidelineTitle"/>
			</h2>
			<table border="0" width="100%" cellpadding="0" cellspacing="0">
				<th colspan="2" height="30"> Actions and Directives</th>
				<xsl:for-each select="//gem:Recommendation">
					<xsl:for-each select="./gem:Conditional">
						<xsl:for-each select="./gem:Action">
							<xsl:variable name="act" select="text()"/>
							<xsl:if test="normalize-space(text()) !=''">
								<xsl:if test="text()[not(.=preceding::text())]">

									<tr>
										<td style="padding-bottom: 10px;padding-top: 10px;padding-left: 10px;padding-right: 10px;border-style:solid;border-width:thin;border-color:#000000">
											<xsl:value-of select="text()"/>
											<xsl:for-each select="//gem:Action">
												<xsl:if test="($act = text())">
													<table>
														<tr>
															<td style="padding-left: 10px;">
																<span style="font-size:10px"> Rec_<xsl:value-of select="../../@id"/>: Cond_<xsl:value-of select="../@id"/>: Act_<xsl:value-of select="@id"/>
																</span>
															</td>
														</tr>
														<xsl:for-each select="./gem:ActionCode">
															<xsl:if test="normalize-space(text()) !=''">
																<tr>
																	<td style="padding-bottom: 1px;padding-top: 1px;padding-left: 10px;padding-right: 10px;">

																		<span style="font-size:10px"> Code Set: <xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} </span>

																	</td>
																</tr>
															</xsl:if>
														</xsl:for-each>
													</table>
												</xsl:if>
											</xsl:for-each>

										</td>
									</tr>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
					<xsl:for-each select="./gem:Imperative">
						<xsl:for-each select="./gem:Directive">
							<xsl:variable name="direct" select="text()"/>
							<xsl:if test="normalize-space(text()) !=''">
								<xsl:if test="text()[not(.=preceding::text())]">
									<tr>
										<td style="padding-bottom: 10px;padding-top: 10px;padding-left: 10px;padding-right: 10px;border-style:solid;border-width:thin;border-color:#000000">
											<xsl:value-of select="text()"/>
											<xsl:for-each select="//gem:Directive">
												<xsl:if test="($direct = text())">
													<table>
														<tr>
															<td style="padding-left: 10px;">
																<span style="font-size:10px"> Rec_<xsl:value-of select="../../@id"/>: Imp_<xsl:value-of select="../@id"/>: Dir_<xsl:value-of select="@id"/>
																</span>

															</td>

														</tr>
														<xsl:for-each select="./gem:DirectiveCode">
															<xsl:if test="normalize-space(text()) !=''">
																<tr>
																	<td style="padding-bottom: 1px;padding-top: 1px;padding-left: 10px;padding-right: 10px;">

																		<span style="font-size:10px"> Code Set: <xsl:value-of select="@codeset"/> {<xsl:value-of select="."/>} </span>

																	</td>
																</tr>
															</xsl:if>
														</xsl:for-each>
													</table>
												</xsl:if>
											</xsl:for-each>
										</td>
									</tr>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</xsl:for-each>
				<tr>
					<td style="border-bottom:thin solid #000000;">
						<span style="font-size:10px"/>
					</td>
				</tr>
			</table>
		</html>
	</xsl:template>
</xsl:stylesheet>
